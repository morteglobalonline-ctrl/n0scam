export type RouteParam = string | string[] | undefined;

export function readInboundValue(param: RouteParam, maxLength: number) {
  const first = Array.isArray(param) ? param[0] : param;
  if (!first || maxLength < 1) return '';
  return first.replaceAll('\0', '').trim().slice(0, maxLength);
}

export function hasTrustedIntakeSource(param: RouteParam) {
  const first = Array.isArray(param) ? param[0] : param;
  return first === 'share-extension' || first === 'safari-extension';
}
