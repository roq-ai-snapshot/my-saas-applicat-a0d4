const mapping: Record<string, string> = {
  'contact-informations': 'contact_information',
  'menu-items': 'menu_item',
  'opening-hours': 'opening_hour',
  orders: 'order',
  'order-items': 'order_item',
  organizations: 'organization',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
