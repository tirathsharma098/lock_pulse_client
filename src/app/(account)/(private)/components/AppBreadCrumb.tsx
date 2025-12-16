"use client";

import { Breadcrumbs, Link, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import NextLink from "next/link";

const UUID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

function isDynamicSegment(seg: string) {
  if (!seg) return false;
  if (/^\d+$/.test(seg)) return true; // numeric id
  if (UUID_REGEX.test(seg)) return true; // uuid
  return false;
}

function prettifyLabel(seg: string) {
  // tweak labels (you can expand this map)
  const map: Record<string, string> = {
    project: "Project",
    service: "Service",
    view: "View",
    edit: "Edit",
    add: "Add",
    credentials: "Credentials",
  };
  return map[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);
}

function getBreadcrumbs(pathname: string) {
  const cleanPath = pathname.split("?")[0].replace(/\/+$/, ""); // remove query and trailing slash
  const parts = cleanPath.split("/").filter(Boolean);

  const crumbs: { href?: string; label: string }[] = [];

  for (let idx = 0; idx < parts.length; idx++) {
    const part = parts[idx];

    if (isDynamicSegment(part)) {
      // skip rendering this segment as a visible crumb
      continue;
    }

    // build concrete href using original parts (keeps ids in href)
    const href = "/" + parts.slice(0, idx + 1 + parts.slice(0, idx + 1).filter(isDynamicSegment).length).join("/");

    // Explanation: above slice logic ensures the href includes any dynamic segments that appeared before this index.
    // Simpler (and robust) approach: rebuild href by walking original parts up to this displayed part:
    let seen = 0;
    let endIndex = -1;
    for (let j = 0; j < parts.length; j++) {
      if (!isDynamicSegment(parts[j])) {
        if (seen === crumbs.length) { endIndex = j; break; }
        seen++;
      }
    }
    // fallback: if endIndex not found, use idx
    const finalIndex = endIndex === -1 ? idx : endIndex;
    const finalHref = "/" + parts.slice(0, finalIndex + 1).join("/");

    crumbs.push({
      href: undefined, // set below for non-last items
      label: prettifyLabel(part),
    });

    // assign href to the last pushed crumb unless it's the final breadcrumb
    crumbs[crumbs.length - 1].href = finalHref;
  }

  // The last crumb should not be a link
  if (crumbs.length > 0) crumbs[crumbs.length - 1].href = undefined;

  return crumbs;
}

export default function AppBreadcrumb() {
  const pathname = usePathname() || "/";
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
