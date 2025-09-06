import type { Position } from "../interface/Position";
import type { PositionCreateRequest } from "../interface/request/PositionCreateRequest";

export class PositionService {
  private readonly BASE_URL: string = 'http://localhost:8080/api/positions';

  async createPosition(positionData: PositionCreateRequest): Promise<Position> {
    const response = await fetch(this.BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(positionData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create position');
    }
    
    return response.json();
  }

  async getPositionsByCompany(companyId: string): Promise<Position[]> {
    const response = await fetch(`${this.BASE_URL}/company/${companyId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch positions by company');
    }
    
    return response.json();
  }

  async updatePosition(id: string, positionData: Partial<Position>): Promise<Position> {
    const response = await fetch(`${this.BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(positionData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update position');
    }
    
    return response.json();
  }
}