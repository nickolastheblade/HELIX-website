from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class ExpertiseItem(BaseModel):
    """Single expertise direction item"""
    id: int
    title: str
    description: str
    icon: str  # Icon name: "globe", "code", "zap", "database", "server", "shield"
    color_accent: str  # Hex color for the single accent detail


class ExpertiseResponse(BaseModel):
    """List of all expertise directions"""
    items: list[ExpertiseItem]


@router.get("/expertise", response_model=ExpertiseResponse)
async def get_expertise() -> ExpertiseResponse:
    """
    Get all expertise directions.
    
    Returns 6 expertise cards with their details.
    Each card has one color accent for the 3D geometric detail.
    """
    expertise_items = [
        ExpertiseItem(
            id=1,
            title="Branding & Identity",
            description="Complete brand development and visual identity systems",
            icon="globe",
            color_accent="#C026D3"
        ),
        ExpertiseItem(
            id=2,
            title="Web Development",
            description="Modern web applications with cutting-edge technologies",
            icon="code",
            color_accent="#C026D3"
        ),
        ExpertiseItem(
            id=3,
            title="Digital Marketing",
            description="Strategic digital campaigns and growth optimization",
            icon="zap",
            color_accent="#C026D3"
        ),
        ExpertiseItem(
            id=4,
            title="Business Analytics",
            description="Data-driven insights and strategic business intelligence",
            icon="database",
            color_accent="#C026D3"
        ),
        ExpertiseItem(
            id=5,
            title="Operational Optimization",
            description="Process automation and efficiency improvements",
            icon="server",
            color_accent="#C026D3"
        ),
        ExpertiseItem(
            id=6,
            title="AI Integration",
            description="Machine learning solutions and intelligent automation",
            icon="shield",
            color_accent="#C026D3"
        ),
    ]
    
    return ExpertiseResponse(items=expertise_items)
