import { httpClient } from "../http-client";
import type { PositionCreateRequest } from "../interface/request/PositionCreateRequest";
import type { PositionUpdateRequest } from "../interface/request/PositionUpdateRequest";
import type { PositionResponse } from "../interface/response/PositionResponse";

export class PositionService {
  private readonly BASE_URL: string = '/positions';

  async createPosition(positionCreateRequest: PositionCreateRequest): Promise<PositionResponse> {
    return httpClient.post<PositionResponse>(this.BASE_URL, positionCreateRequest);
  }

  async getPositions(): Promise<PositionResponse[]> {
    return httpClient.get<PositionResponse[]>(this.BASE_URL);
  }

  async patchPosition(id: string, positionUpdateRequest: Partial<PositionUpdateRequest>): Promise<PositionResponse> {
    return httpClient.patch<PositionResponse>(`${this.BASE_URL}/${id}`, positionUpdateRequest);
  }
}