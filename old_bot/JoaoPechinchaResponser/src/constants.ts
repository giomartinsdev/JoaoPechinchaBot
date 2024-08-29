export const EMOJIS = ['🔵', '🟢', '⚫', '💖', '⚪️', '🟠',
  '🟤', '🧨', '🟡', '⭐', '🛍️', '💥', '🚨,', '🚚', '🫰🏻', '🏻'];
export const FORBIDDEN_WORDS = ['grupo', 'produtos', 'promocao', 'frete', 'pegar', 'avaliacao', 'clique',
  'exclusivo', 'preco', 'pode', 'inspirado', 'desconto', 'review', 'entrar', 'cadastre-se', 'entrar', 'compra'];
export const PRICE_PATTERN = /R\$\s*\d+[\.,]?\d*/g;
export const URL_PATTERN = /https?:\/\/\S+/g;
export const COUPON_PATTERN = /cupom:?\s*[*]?([\w\d]+)[*]?/gi;
export const PRODUCT_PATTERN = /^(?!.*(R\$|\bpor\b|\bcupom\b|https?:\/\/)).+$/gmi;