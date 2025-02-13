from decouple import config
ORS_BASE_URL = config("ORS_BASE_URL")
OTP_BASE_URL = config("OTP_BASE_URL")
OTP_HEADER = {"Content-Type": "application/json"}
OTP_AVG_WALKING_SPEED = 1.385
def otp_query(start, end, wheelchair_accessible, num_trip_patterns):
    return {
    "query": f"""
    query PublicTransportQuery {{
    trip(
    wheelchairAccessible: {str(wheelchair_accessible).lower()}
    numTripPatterns: {num_trip_patterns}
    walkReluctance: 2.0
    from: {{
        coordinates: {{
        latitude: {start[1]}
        longitude: {start[0]}
        }}
    }}
    to: {{
        coordinates: {{
        latitude: {end[1]}
        longitude: {end[0]}
        }}
    }}
    ) {{
    tripPatterns {{
        expectedEndTime
        duration
        distance
        legs {{
        mode
        distance
        duration
        fromPlace {{
        name
        latitude
        longitude
        }}
        toPlace {{
        name
        latitude
        longitude
        }}
        # Bus number/Metro line
        line {{
        publicCode
        name
        }}
        # Detailed foot steps
        steps{{
        distance
        relativeDirection
        streetName
        heading
        stayOn
        latitude
        longitude
        }}
        # Intermediate bus/metro stops
        intermediateQuays{{
        name
        latitude
        longitude
        }}
        # The whole path encoded. Use polyline.decode() to get the coordinates
        pointsOnLink {{
        points
        }}
        }}
    }}
    }}
    }}
    """
    }