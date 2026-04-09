package com.civic.services;

import com.drew.imaging.ImageMetadataReader;
import com.drew.metadata.Metadata;
import com.drew.metadata.exif.GpsDirectory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

/**
 * Service for verifying complaint submissions using GPS data.
 * Cross-validates device GPS, map pin location, and photo EXIF GPS metadata.
 */
@Service
public class GeoVerificationService {

    // Maximum distance (meters) between device GPS and map pin
    private static final double DEVICE_TO_MAP_THRESHOLD_METERS = 500.0;

    // Maximum distance (meters) between photo EXIF GPS and map pin
    // Slightly more lenient due to EXIF precision variations
    private static final double EXIF_TO_MAP_THRESHOLD_METERS = 1000.0;

    // Earth radius in meters (for Haversine formula)
    private static final double EARTH_RADIUS_METERS = 6_371_000.0;

    /**
     * Verify the complaint location by cross-checking device GPS, map pin, and photo EXIF GPS.
     */
    public GeoVerificationResult verifyComplaintLocation(
            Double deviceLat, Double deviceLng,
            Double mapLat, Double mapLng,
            MultipartFile image) {

        // Step 1: Validate device GPS vs map pin distance
        if (deviceLat == null || deviceLng == null || mapLat == null || mapLng == null) {
            return new GeoVerificationResult(false, "GPS data missing — location could not be verified.");
        }

        double deviceToMapDistance = calculateDistance(deviceLat, deviceLng, mapLat, mapLng);

        if (deviceToMapDistance > DEVICE_TO_MAP_THRESHOLD_METERS) {
            return new GeoVerificationResult(false,
                    String.format("Map pin is %.0fm from your device location (max %,.0fm allowed).",
                            deviceToMapDistance, DEVICE_TO_MAP_THRESHOLD_METERS));
        }

        // Step 2: Try to extract EXIF GPS from the photo
        if (image == null || image.isEmpty()) {
            return new GeoVerificationResult(true,
                    "Device GPS verified (no photo attached for EXIF check).");
        }

        double[] exifGps = extractExifGps(image);

        if (exifGps == null) {
            // Photo doesn't have GPS metadata — still allow but note it
            return new GeoVerificationResult(true,
                    "Device GPS verified. Photo has no GPS metadata (EXIF check skipped).");
        }

        // Step 3: Compare EXIF GPS with map pin
        double exifToMapDistance = calculateDistance(exifGps[0], exifGps[1], mapLat, mapLng);

        if (exifToMapDistance > EXIF_TO_MAP_THRESHOLD_METERS) {
            return new GeoVerificationResult(false,
                    String.format("Photo GPS is %.0fm from reported location (max %,.0fm allowed). " +
                            "Photo appears to be taken at a different location.",
                            exifToMapDistance, EXIF_TO_MAP_THRESHOLD_METERS));
        }

        return new GeoVerificationResult(true,
                String.format("Fully verified — Device GPS, map pin, and photo GPS all match (photo %.0fm from pin).",
                        exifToMapDistance));
    }

    /**
     * Extract GPS coordinates from the EXIF metadata of an image.
     * @return double[] {latitude, longitude} or null if no GPS data found
     */
    public double[] extractExifGps(MultipartFile image) {
        try (InputStream inputStream = image.getInputStream()) {
            Metadata metadata = ImageMetadataReader.readMetadata(inputStream);
            GpsDirectory gpsDirectory = metadata.getFirstDirectoryOfType(GpsDirectory.class);

            if (gpsDirectory == null || gpsDirectory.getGeoLocation() == null) {
                return null;
            }

            return new double[]{
                    gpsDirectory.getGeoLocation().getLatitude(),
                    gpsDirectory.getGeoLocation().getLongitude()
            };
        } catch (Exception e) {
            // If we can't read metadata, treat as no GPS data
            return null;
        }
    }

    /**
     * Calculate the distance between two GPS coordinates using the Haversine formula.
     * @return distance in meters
     */
    public double calculateDistance(double lat1, double lng1, double lat2, double lng2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_METERS * c;
    }

    /**
     * Result of geo-verification check.
     */
    public static class GeoVerificationResult {
        private final boolean geoVerified;
        private final String note;

        public GeoVerificationResult(boolean geoVerified, String note) {
            this.geoVerified = geoVerified;
            this.note = note;
        }

        public boolean isGeoVerified() {
            return geoVerified;
        }

        public String getNote() {
            return note;
        }
    }
}
