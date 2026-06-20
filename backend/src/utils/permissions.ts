export const permissionCatalog = [
  {
    group: "Engagements",
    permissions: [
      "engagement:view:own",
      "engagement:view:all",
      "engagement:create",
      "engagement:update:own",
      "engagement:update:all",
      "engagement:delete",
      "engagement:assign_owner"
    ]
  },
  {
    group: "Notes Intelligence",
    permissions: [
      "notes:view:own",
      "notes:view:all",
      "notes:create",
      "notes:extract_ai",
      "notes:apply_extraction",
      "notes:view_raw"
    ]
  },
  {
    group: "Commitments",
    permissions: [
      "commitment:view:own",
      "commitment:view:all",
      "commitment:create",
      "commitment:update:own",
      "commitment:update:all",
      "commitment:delete"
    ]
  },
  {
    group: "Risks & Blockers",
    permissions: [
      "risk:view:own",
      "risk:view:all",
      "risk:create",
      "risk:update:own",
      "risk:update:all",
      "risk:delete"
    ]
  },
  {
    group: "Product Signals",
    permissions: [
      "product_signal:view:own",
      "product_signal:view:all",
      "product_signal:create",
      "product_signal:update",
      "product_signal:review",
      "product_signal:dismiss",
      "product_signal:send_to_roadmap"
    ]
  },
  {
    group: "Readiness",
    permissions: ["readiness:view", "readiness:update", "readiness:create_defaults"]
  },
  {
    group: "Status Updates",
    permissions: ["status_update:view", "status_update:generate", "status_update:create", "status_update:delete"]
  },
  {
    group: "Dashboards",
    permissions: [
      "dashboard:view_my",
      "dashboard:view_command_center",
      "dashboard:view_executive",
      "dashboard:view_product_intelligence",
      "dashboard:view_team_workload"
    ]
  },
  {
    group: "Administration",
    permissions: [
      "admin:view_users",
      "admin:create_users",
      "admin:update_users",
      "admin:disable_users",
      "admin:view_roles",
      "admin:update_roles",
      "admin:test_permissions"
    ]
  }
] as const;

export const allPermissions = permissionCatalog.flatMap((group) => group.permissions);

export const defaultRoleDefinitions = [
  {
    key: "admin",
    name: "Admin",
    description: "Full organization administration and workspace control.",
    isSystemRole: true,
    isEditable: false,
    defaultLandingPage: "/dashboard",
    permissions: allPermissions
  },
  {
    key: "fde",
    name: "FDE",
    description: "Forward-deployed engineer focused on assigned engagements.",
    isSystemRole: true,
    isEditable: true,
    defaultLandingPage: "/engagements",
    permissions: [
      "engagement:view:own",
      "engagement:create",
      "engagement:update:own",
      "notes:view:own",
      "notes:create",
      "notes:extract_ai",
      "notes:apply_extraction",
      "notes:view_raw",
      "commitment:view:own",
      "commitment:create",
      "commitment:update:own",
      "risk:view:own",
      "risk:create",
      "risk:update:own",
      "product_signal:view:own",
      "product_signal:create",
      "readiness:view",
      "readiness:update",
      "status_update:view",
      "status_update:generate",
      "dashboard:view_my"
    ]
  },
  {
    key: "fde_manager",
    name: "FDE Manager",
    description: "Manager with command-center visibility across deployments.",
    isSystemRole: true,
    isEditable: true,
    defaultLandingPage: "/dashboard",
    permissions: [
      "engagement:view:all",
      "engagement:create",
      "engagement:update:all",
      "engagement:assign_owner",
      "notes:view:all",
      "notes:create",
      "notes:extract_ai",
      "notes:apply_extraction",
      "notes:view_raw",
      "commitment:view:all",
      "commitment:create",
      "commitment:update:all",
      "commitment:delete",
      "risk:view:all",
      "risk:create",
      "risk:update:all",
      "risk:delete",
      "product_signal:view:all",
      "product_signal:create",
      "readiness:view",
      "readiness:update",
      "readiness:create_defaults",
      "status_update:view",
      "status_update:generate",
      "status_update:create",
      "dashboard:view_command_center",
      "dashboard:view_team_workload",
      "dashboard:view_product_intelligence"
    ]
  },
  {
    key: "executive",
    name: "Executive",
    description: "Read-only executive overview of deployment health.",
    isSystemRole: true,
    isEditable: true,
    defaultLandingPage: "/executive",
    permissions: [
      "engagement:view:all",
      "commitment:view:all",
      "risk:view:all",
      "product_signal:view:all",
      "readiness:view",
      "status_update:view",
      "dashboard:view_executive",
      "dashboard:view_command_center"
    ]
  },
  {
    key: "product_manager",
    name: "Product Manager",
    description: "Product intelligence and feedback triage.",
    isSystemRole: true,
    isEditable: true,
    defaultLandingPage: "/product-intelligence",
    permissions: [
      "engagement:view:all",
      "notes:view:all",
      "commitment:view:all",
      "risk:view:all",
      "product_signal:view:all",
      "product_signal:update",
      "product_signal:review",
      "product_signal:dismiss",
      "product_signal:send_to_roadmap",
      "dashboard:view_product_intelligence"
    ]
  }
];

export type RoleKey = (typeof defaultRoleDefinitions)[number]["key"];
