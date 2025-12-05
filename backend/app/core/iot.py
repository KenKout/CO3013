# app/services/iot_service.py
from datetime import datetime, timedelta
import httpx
from typing import Optional
from app.core.config import settings
from app.models import Booking

class IoTService:    
    def __init__(self):
        self.base_url = settings.IOT_SERVER_URL
        self.api_token = settings.IOT_API_TOKEN
    
    async def create_session(
        self,
        booking: Booking,
        room_id: str | int,
    ) -> dict | None:
        try:
            start_datetime = datetime.combine(booking.booking_date, booking.start_time)
            end_datetime = datetime.combine(booking.booking_date, booking.end_time)
            duration_minutes = int((end_datetime - start_datetime).total_seconds() / 60)
            payload = {
                "room_id": room_id,
                "duration_minutes": duration_minutes,
                "startTime": start_datetime.isoformat(),
            }
        
            headers = {"Content-Type": "application/json"}
            if self.api_token:
                # headers["Authorization"] = f"Bearer {self.api_token}"
                print("Using x-private-key for IoT authentication",self.api_token)
                headers["x-private-key"] = self.api_token
            
            # Make request to IoT server
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    f"{self.base_url}/api/sessions",
                    json=payload,
                    headers=headers,
                )
                response.raise_for_status()
                
                result = response.json()
                print(
                    f"IoT session created for booking {booking.id}: "
                    f"QR Code: {result.get('qr_code')}, Valid until: {result.get('valid_until')}"
                )
                return result
                
        except httpx.HTTPError as e:
            print(f"Failed to create IoT session for booking {booking.id}: {str(e)}")
            return None
        except Exception as e:
            print(f"Unexpected error creating IoT session: {str(e)}")
            return None
    
    async def delete_session(self, session_id: str) -> bool:
        if not self.enabled:
            return True
        
        try:
            headers = {}
            if self.api_token:
                # headers["Authorization"] = f"Bearer {self.api_token}"
                print("Using x-private-key for IoT authentication",self.api_token)
                headers["x-private-key"] = self.api_token
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.delete(
                    f"{self.base_url}/api/sessions/{session_id}",
                    headers=headers,
                )
                response.raise_for_status()
                logger.info(f"IoT session {session_id} deleted")
                return True
                
        except httpx.HTTPError as e:
            logger.error(f"Failed to delete IoT session {session_id}: {str(e)}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error deleting IoT session: {str(e)}")
            return False
    async def trigger_door_open(self,room_id:str) -> bool:
        try:
            headers = {}
            if self.api_token:
                print("Using x-private-key for IoT authentication",self.api_token)
                headers["x-private-key"] = self.api_token
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.base_url}/open-door",
                    params={"room": room_id},
                    headers=headers,
                )
                response.raise_for_status()
                print(f"Door open triggered for room {room_id}")
                return True
                
        except httpx.HTTPError as e:
            print(f"Failed to trigger door open for room {room_id}: {str(e)}")
            return False
        except Exception as e:
            print(f"Unexpected error triggering door open: {str(e)}")
            return False

iot_service = IoTService()