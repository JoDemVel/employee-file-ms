import type { Position } from '../interfaces/position';
import { positions } from './positions';

export async function getMockPositions(companyId: string): Promise<Position[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredPositions = positions.filter(
        (position) => position.companyId === companyId
      );
      resolve(filteredPositions);
    }, 250);
  });
}

export async function getMockPositionsByDepartment(
  departmentId: string,
  companyId: string
): Promise<Position[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredPositions = positions.filter(
        (position) =>
          position.departmentId === departmentId &&
          position.companyId === companyId
      );
      resolve(filteredPositions);
    }, 250);
  });
}

export async function addMockPosition(
  position: Omit<Position, 'id'>
): Promise<Position> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPosition: Position = {
        ...position,
        id: crypto.randomUUID(),
      };
      positions.push(newPosition);
      resolve(newPosition);
    }, 250);
  });
}
