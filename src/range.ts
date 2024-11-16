/**
 * Return whether 2 interbase coordinate ranges intersect.
 *
 * @param left1 -
 * @param right1 -
 * @param left2 -
 * @param right2 -
 *
 * @returns true if the two ranges intersect
 */
export function doesIntersect2(
  left1: number,
  right1: number,
  left2: number,
  right2: number,
) {
  return right1 > left2 && left1 < right2
}
