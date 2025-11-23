"""Tests for spaces and utilities endpoints."""
import pytest
from httpx import AsyncClient

from app.models import User, Space, Utility


class TestListSpaces:
    """Tests for GET /spaces"""

    async def test_list_spaces_empty(self, client: AsyncClient):
        """Test listing spaces when none exist."""
        response = await client.get("/spaces")

        assert response.status_code == 200
        data = response.json()
        assert data["data"] == []
        assert data["meta"]["total"] == 0

    async def test_list_spaces_with_data(self, client: AsyncClient, test_space: Space):
        """Test listing spaces with existing data."""
        response = await client.get("/spaces")

        assert response.status_code == 200
        data = response.json()
        assert len(data["data"]) == 1
        assert data["data"][0]["name"] == test_space.name
        assert data["meta"]["total"] == 1

    async def test_list_spaces_pagination(self, client: AsyncClient, test_space: Space):
        """Test spaces pagination."""
        response = await client.get("/spaces", params={"limit": 10, "offset": 0})

        assert response.status_code == 200
        data = response.json()
        assert data["meta"]["limit"] == 10
        assert data["meta"]["offset"] == 0

    async def test_list_spaces_filter_by_building(self, client: AsyncClient, test_space: Space):
        """Test filtering spaces by building."""
        response = await client.get("/spaces", params={"building": test_space.building})

        assert response.status_code == 200
        data = response.json()
        assert len(data["data"]) == 1

        response = await client.get("/spaces", params={"building": "Nonexistent"})
        data = response.json()
        assert len(data["data"]) == 0

    async def test_list_spaces_filter_by_capacity(self, client: AsyncClient, test_space: Space):
        """Test filtering spaces by capacity."""
        response = await client.get("/spaces", params={"capacityMin": 5})

        assert response.status_code == 200
        data = response.json()
        assert len(data["data"]) == 1

        response = await client.get("/spaces", params={"capacityMin": 100})
        data = response.json()
        assert len(data["data"]) == 0


class TestGetSpace:
    """Tests for GET /spaces/{space_id}"""

    async def test_get_space_success(self, client: AsyncClient, test_space: Space):
        """Test getting a single space."""
        response = await client.get(f"/spaces/{test_space.id}")

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == test_space.id
        assert data["name"] == test_space.name

    async def test_get_space_not_found(self, client: AsyncClient):
        """Test getting non-existent space."""
        response = await client.get("/spaces/99999")

        assert response.status_code == 404


class TestCreateSpace:
    """Tests for POST /spaces"""

    async def test_create_space_as_admin(self, client: AsyncClient, admin_headers: dict):
        """Test creating a space as admin."""
        response = await client.post("/spaces", headers=admin_headers, json={
            "name": "New Room",
            "building": "New Building",
            "floor": "2",
            "capacity": 20,
            "status": "active",
            "utilities": [],
        })

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "New Room"
        assert data["building"] == "New Building"
        assert data["capacity"] == 20

    async def test_create_space_as_user_forbidden(self, client: AsyncClient, auth_headers: dict):
        """Test creating a space as regular user fails."""
        response = await client.post("/spaces", headers=auth_headers, json={
            "name": "New Room",
            "building": "New Building",
            "floor": "2",
            "capacity": 20,
            "status": "active",
            "utilities": [],
        })

        assert response.status_code == 403

    async def test_create_space_with_utilities(
        self, client: AsyncClient, admin_headers: dict, test_utilities: list[Utility]
    ):
        """Test creating a space with utilities."""
        # Use the actual utility keys from the fixture
        utility_keys = [u.key for u in test_utilities[:2]]
        response = await client.post("/spaces", headers=admin_headers, json={
            "name": "Room with Utils",
            "building": "Building A",
            "floor": "1",
            "capacity": 10,
            "status": "active",
            "utilities": utility_keys,
        })

        assert response.status_code == 201
        data = response.json()
        for key in utility_keys:
            assert key in data["utilities"]

    async def test_create_space_invalid_capacity(self, client: AsyncClient, admin_headers: dict):
        """Test creating a space with invalid capacity fails."""
        response = await client.post("/spaces", headers=admin_headers, json={
            "name": "Invalid Room",
            "building": "Building",
            "floor": "1",
            "capacity": 0,
            "status": "active",
            "utilities": [],
        })

        assert response.status_code == 422


class TestUpdateSpace:
    """Tests for PATCH /spaces/{space_id}"""

    async def test_update_space_as_admin(
        self, client: AsyncClient, admin_headers: dict, test_space: Space
    ):
        """Test updating a space as admin."""
        response = await client.patch(
            f"/spaces/{test_space.id}",
            headers=admin_headers,
            json={"name": "Updated Name", "capacity": 25}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Name"
        assert data["capacity"] == 25

    async def test_update_space_as_user_forbidden(
        self, client: AsyncClient, auth_headers: dict, test_space: Space
    ):
        """Test updating a space as regular user fails."""
        response = await client.patch(
            f"/spaces/{test_space.id}",
            headers=auth_headers,
            json={"name": "Updated Name"}
        )

        assert response.status_code == 403


class TestDeleteSpace:
    """Tests for DELETE /spaces/{space_id}"""

    async def test_delete_space_as_admin(
        self, client: AsyncClient, admin_headers: dict, test_space: Space
    ):
        """Test deleting a space as admin."""
        response = await client.delete(f"/spaces/{test_space.id}", headers=admin_headers)

        assert response.status_code == 204

        # Verify deleted
        response = await client.get(f"/spaces/{test_space.id}")
        assert response.status_code == 404

    async def test_delete_space_as_user_forbidden(
        self, client: AsyncClient, auth_headers: dict, test_space: Space
    ):
        """Test deleting a space as regular user fails."""
        response = await client.delete(f"/spaces/{test_space.id}", headers=auth_headers)

        assert response.status_code == 403


class TestUtilities:
    """Tests for utilities endpoints."""

    async def test_list_utilities(self, client: AsyncClient, test_utilities: list[Utility]):
        """Test listing utilities."""
        response = await client.get("/utilities")

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 3

    async def test_create_utility_as_admin(self, client: AsyncClient, admin_headers: dict):
        """Test creating a utility as admin."""
        response = await client.post("/utilities", headers=admin_headers, json={
            "key": "projector",
            "label": "Projector",
            "description": "Video projector",
        })

        assert response.status_code == 201
        data = response.json()
        assert data["key"] == "projector"

    async def test_create_utility_duplicate_key(
        self, client: AsyncClient, admin_headers: dict, test_utilities: list[Utility]
    ):
        """Test creating utility with duplicate key fails."""
        # Use actual key from fixture
        existing_key = test_utilities[0].key
        response = await client.post("/utilities", headers=admin_headers, json={
            "key": existing_key,
            "label": "Duplicate Utility",
        })

        assert response.status_code == 409

    async def test_delete_utility(
        self, client: AsyncClient, admin_headers: dict, test_utilities: list[Utility]
    ):
        """Test deleting a utility."""
        utility_id = test_utilities[0].id
        response = await client.delete(f"/utilities/{utility_id}", headers=admin_headers)

        assert response.status_code == 204
