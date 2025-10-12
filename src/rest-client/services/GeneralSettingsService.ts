import { httpClient } from "../http-client";
import type { GeneralSettingsCreateRequest } from "../interface/request/GeneralSettingsCreateRequest";
import type { GeneralSettingsUpdateRequest } from "../interface/request/GeneralSettingsUpdateRequest";
import type { GeneralSettingsResponse } from "../interface/response/GeneralSettingsResponse";

export class GeneralSettingsService {
  private readonly BASE_URL: string = '/general-settings';

  async createSettings(settingsCreateRequest: Partial<GeneralSettingsCreateRequest>): Promise<GeneralSettingsResponse> {
    return httpClient.post<GeneralSettingsResponse>(this.BASE_URL, settingsCreateRequest);
  }

  async getSettings(): Promise<GeneralSettingsResponse> {
    return httpClient.get<GeneralSettingsResponse>(this.BASE_URL);
  }

  async patchSettings(settingsUpdateRequest: Partial<GeneralSettingsUpdateRequest>): Promise<GeneralSettingsResponse> {
    return httpClient.put<GeneralSettingsResponse>(this.BASE_URL, settingsUpdateRequest);
  }
}