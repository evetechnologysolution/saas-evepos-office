import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/assets/icons/sidebar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  dashboard: getIcon('ic_dashboard'),
  pos: getIcon('ic_pos'),
  order: getIcon('ic_order'),
  delivery: getIcon('ic_delivery'),
  pickup: getIcon('ic_pickup'),
  scan: getIcon('ic_scan'),
  history: getIcon('ic_history'),
  customer: getIcon('ic_customer'),
  member: getIcon('ic_member'),
  cashier: getIcon('ic_cash_cashier'),
  cart: getIcon('ic_cart'),
  printCount: getIcon('ic_print_count'),
  expense: getIcon('ic_expense'),
  report: getIcon('ic_report'),
  library: getIcon('ic_library'),
  content: getIcon('ic_content'),
  setting: getIcon('ic_setting'),
  user: getIcon('ic_user'),
  chat: getIcon('ic_chat'),
};

export const useNavConfig = () => {
  return [
    // GENERAL
    // ----------------------------------------------------------------------
    {
      subheader: 'General',
      items: [
        {
          title: 'Dashboard',
          path: PATH_DASHBOARD.app,
          icon: ICONS.dashboard,
          roles: ['super admin', 'admin'],
        },
        // tenant
        {
          title: 'tenant',
          path: '/dashboard/tenant',
          icon: ICONS.user,
          roles: ['super admin', 'admin'],
        },
      ],
    },

    // MANAGEMENT
    // ----------------------------------------------------------------------
    // LIBRARY
    {
      subheader: 'management',
      items: [
        // // CONTENT MANAGER
        // {
        //   title: 'Content Manager',
        //   path: PATH_DASHBOARD.content.root,
        //   icon: ICONS.content,
        //   roles: ['super admin', 'Content Writer'],
        //   children: [
        //     { title: 'blog', path: PATH_DASHBOARD.content.blog },
        //     { title: 'gallery', path: PATH_DASHBOARD.content.gallery },
        //     { title: 'blog category', path: PATH_DASHBOARD.content.category },
        //   ],
        // },
        // // REPORT
        // {
        //   title: 'report',
        //   path: PATH_DASHBOARD.report.root,
        //   icon: ICONS.report,
        //   roles: ['super admin', 'admin'],
        //   children: [
        //     { title: 'sales report', path: PATH_DASHBOARD.report.sales },
        //     { title: 'popular product', path: PATH_DASHBOARD.report.popular },
        //     { title: 'payment overview', path: PATH_DASHBOARD.report.paymentOverview },
        //   ],
        // },
        // // LIBRARY
        // {
        //   title: 'library',
        //   path: PATH_DASHBOARD.library.root,
        //   icon: ICONS.library,
        //   roles: ['super admin', 'admin'],
        //   children: [
        //     { title: 'category', path: PATH_DASHBOARD.library.category },
        //     { title: 'sub category', path: PATH_DASHBOARD.library.subcategory },
        //     { title: 'product', path: PATH_DASHBOARD.library.product },
        //     { title: 'variant', path: PATH_DASHBOARD.library.variant },
        //     { title: 'promotion', path: PATH_DASHBOARD.library.promotion },
        //   ],
        // },
        // SETTINGS
        // {
        //   title: 'settings',
        //   path: PATH_DASHBOARD.settings.root,
        //   icon: ICONS.setting,
        //   roles: ['super admin', 'admin'],
        //   children: [
        //     { title: 'general setting', path: PATH_DASHBOARD.settings.generalSetting },
        //     { title: 'tax setting', path: PATH_DASHBOARD.settings.tax },
        //     { title: 'receipt setting', path: PATH_DASHBOARD.settings.receiptSetting },
        //   ],
        // },
        // USER
        {
          title: 'user',
          path: '/dashboard/user',
          icon: ICONS.user,
          roles: ['super admin', 'admin'],
        },
      ],
    },
  ];
};
