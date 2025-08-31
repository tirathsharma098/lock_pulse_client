"use client";

import { Breadcrumbs, Link, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import NextLink from "next/link";

// Map dynamic routes to static equivalents
const routeMap: Record<string, string> = {
  "/project/[projectId]/view": "/project/view",
  "/project/[projectId]/edit": "/project/edit",
  "/project/[projectId]/add": "/project/add",
  "/project/[projectId]/service/[serviceId]/view": "/project/service/view",
  "/project/[projectId]/service/[serviceId]/edit": "/project/service/edit",
  "/project/[projectId]/service/[serviceId]/add": "/project/service/add",
  "/project/[projectId]/service/[serviceId]/credentials/view":
    "/project/service/credentials/view",
  "/project/[projectId]/service/[serviceId]/credentials/edit":
    "/project/service/credentials/edit",
  "/project/[projectId]/service/[serviceId]/credentials/add":
    "/project/service/credentials/add",
};

function getBreadcrumbs(pathname: string): { href?: string; label: string }[] {
  // normalize dynamic routes -> static paths
  const parts = pathname.split("/").filter(Boolean);

  // replace dynamic ids with nothing
  const normalizedParts = parts.map((p) =>
    p.match(/^\[.*\]$/) ? "" : p
  ).filter(Boolean);

  // rebuild path incrementally
  const crumbs: { href?: string; label: string }[] = [];
  let currentPath = "";

  for (let i = 0; i < normalizedParts.length; i++) {
    currentPath += "/" + normalizedParts[i];

    // check if dynamic route mapping exists
    const mapped = Object.values(routeMap).find((route) =>
      currentPath.endsWith(route)
    );

    crumbs.push({
      href: i === normalizedParts.length - 1 ? undefined : mapped || currentPath,
      label: normalizedParts[i].charAt(0).toUpperCase() + normalizedParts[i].slice(1),
    });
  }

  return crumbs;
}

export default function AppBreadcrumb() {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link component={NextLink} underline="hover" color="inherit" href="/account">
        Home
      </Link>
      {breadcrumbs.map((crumb, idx) =>
        crumb.href ? (
          <Link
            key={idx}
            component={NextLink}
            underline="hover"
            color="inherit"
            href={crumb.href}
          >
            {crumb.label}
          </Link>
        ) : (
          <Typography key={idx} sx={{ color: "text.primary" }}>
            {crumb.label}
          </Typography>
        )
      )}
    </Breadcrumbs>
  );
}
