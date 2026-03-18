// src/common/id.utils.ts
export function random5Digits(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}
