from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class Partner(BaseModel):
    """Single partner company"""
    id: int
    name: str
    logo_url: str
    website_url: str
    description: str | None = None


class PartnersResponse(BaseModel):
    """List of all partner companies"""
    items: list[Partner]


@router.get("/partners", response_model=PartnersResponse)
async def get_partners() -> PartnersResponse:
    """
    Get all partner companies.
    
    Returns partner cards including company name, logo, website link, and optional description.
    """
    partners_items = [
        Partner(
            id=1,
            name="Splav",
            logo_url="https://raw.githubusercontent.com/nickolastheblade/logos/main/splav%20wh.svg",
            website_url="https://splav1.su"
        ),
        Partner(
            id=2,
            name="Space Dynamics Architects",
            logo_url="https://raw.githubusercontent.com/nickolastheblade/logos/main/SDA%20vector-01.svg",
            website_url="https://sda.example.com"
        ),
        Partner(
            id=3,
            name="morph.in",
            logo_url="https://raw.githubusercontent.com/nickolastheblade/logos/main/CLEAR%20morphin-logo-white.svg",
            website_url="https://morphin.pro"
        ),
    ]
    
    return PartnersResponse(items=partners_items)
