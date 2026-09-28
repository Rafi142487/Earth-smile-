export const EARTH_SMILE_PHONE = '6300136446';
export const EARTH_SMILE_INTL_PHONE = '916300136446';

export interface WhatsAppMessageParams {
  productName?: string;
  quantity?: number;
  customBranding?: boolean;
  companyName?: string;
  senderName?: string;
  customQuery?: string;
}

export function buildWhatsAppUrl(params: WhatsAppMessageParams = {}): string {
  const {
    productName,
    quantity,
    customBranding,
    companyName,
    senderName,
    customQuery,
  } = params;

  let text = 'Hi Earth Smile, ';

  if (senderName && companyName) {
    text += `I am ${senderName} from ${companyName}. `;
  } else if (senderName) {
    text += `I am ${senderName}. `;
  }

  if (productName) {
    text += `I am interested in ${productName}. `;
    if (quantity && quantity > 0) {
      text += `Estimated quantity: ${quantity} units. `;
    }
    if (customBranding) {
      text += 'We are looking for custom logo branding / private label options. ';
    } else {
      text += 'I would like to know about pricing, MOQ, and delivery timelines. ';
    }
  } else if (customQuery) {
    text += customQuery;
  } else {
    text += 'I am interested in your eco-friendly dental care products, bulk pricing, and custom private-label branding.';
  }

  const encoded = encodeURIComponent(text.trim());
  return `https://wa.me/${EARTH_SMILE_INTL_PHONE}?text=${encoded}`;
}
