// src/utils/maplibreWebMock.js
// Mock implementation of MapLibre for web platform

import React from 'react';

// Mock MapView component
const MapView = ({ children, ...props }) => {
    return React.createElement('div', {
        style: {
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #ccc',
            borderRadius: '8px',
            ...props.style
        }
    }, [
        React.createElement('div', {
            key: 'map-placeholder',
            style: {
                textAlign: 'center',
                color: '#666',
                fontSize: '14px'
            }
        }, 'Map not available on web platform'),
        children
    ]);
};

// Mock other MapLibre components
const Camera = ({ children, ...props }) => children || null;
const MarkerView = ({ children, ...props }) => children || null;
const PointAnnotation = ({ children, ...props }) => children || null;
const Callout = ({ children, ...props }) => children || null;
const UserLocation = () => null;
const Logger = {
    setLogLevel: () => {},
    setLogCallback: () => {}
};

// Mock constants
const UserTrackingMode = {
    None: 0,
    Follow: 1,
    FollowWithHeading: 2,
    FollowWithCourse: 3
};

const CameraModes = {
    Flight: 'flight',
    Ease: 'ease',
    Linear: 'linear'
};

// Export all components and utilities
export default MapView;
export {
    MapView,
    Camera,
    MarkerView,
    PointAnnotation,
    Callout,
    UserLocation,
    Logger,
    UserTrackingMode,
    CameraModes
};

// Default export for different import styles
module.exports = {
    default: MapView,
    MapView,
    Camera,
    MarkerView,
    PointAnnotation,
    Callout,
    UserLocation,
    Logger,
    UserTrackingMode,
    CameraModes
};