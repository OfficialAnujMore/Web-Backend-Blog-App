export const stripHtml = (html = '') => html.replace(/<[^>]*>/g, ' ');

export const estimateReadTime = ({ contentHtml = '', title = '', summary = '' } = {}) => {
  const text = `${stripHtml(contentHtml)} ${title} ${summary}`;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};
