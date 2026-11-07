export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatRating(rating: number) {
  return rating.toFixed(1);
}
