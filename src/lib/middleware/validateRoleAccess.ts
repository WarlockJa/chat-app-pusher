import { NextRequest, NextResponse } from "next/server";

// routes anyone can access
const unrestrictedRoutes: IRouteData[] = [
  { path: "/api/v1/auth", method: "POST" },
  { path: "/api/v1/pusher/auth", method: "POST" },
  { path: "/api/v1/db/channel/owner", method: "GET" },
  { path: "/api/v1/db/channel", method: "POST" },
];
// jwt protected routes array
// only owner and admin can access
const ownerRestrictedRoutes: IRouteData[] = [
  { path: "/api/v1/db/channel/lastmessage", method: "GET" },
  { path: "/api/v1/db/messages/history", method: "GET" },
  { path: "/api/v1/db/messages/lastaccess", method: "POST" },
  { path: "/api/v1/db/messages/new", method: "GET" },
  { path: "/api/v1/db/messages/new", method: "POST" },
  { path: "/api/v1/pusher/message", method: "POST" },
  { path: "/api/v1/pusher/typing", method: "POST" },
];
// only admin can access
const adminRestrictedRoutes: IRouteData[] = [
  { path: "/api/v1/db/channel", method: "GET" },
  { path: "/api/v1/db/channel", method: "DELETE" },
];

export async function validateRoleAccess(
  request: NextRequest,
  session: ISession
) {
  // if user is an administrator skipping all checks
  if (!session.userToken.user_admin) {
    // forming route data object
    const routeData: IRouteData = {
      path: request.nextUrl.pathname,
      method: request.method,
    };

    // accessed route is not unrestricted. Else skipping the rest of the checks
    if (
      unrestrictedRoutes.findIndex(
        (route) =>
          route.path === routeData.path && route.method === routeData.method
      ) === -1
    ) {
      // accessed route requires admin rights
      if (
        adminRestrictedRoutes.findIndex(
          (route) =>
            route.path === routeData.path && route.method === routeData.method
        ) !== -1
      ) {
        // unauthorized access
        return NextResponse.json("unauthorized", {
          status: 403,
          statusText: "unauthorized",
        });
      }

      // accessed route is owner restricted
      if (
        ownerRestrictedRoutes.findIndex(
          (route) =>
            route.path === routeData.path && route.method === routeData.method
        ) !== -1
      ) {
        // all ownerRestrictedRoutes routes have channel_name passed with them
        // for GET requests it will be in request url params
        // for POST requests inside of the request body
        // to verify that request is send by the owner of the channel
        // channel_name must contain user_id found in session.accessToken

        // checking if request made by the channel owner
        let requestIsByOwner = false;
        try {
          if (routeData.method === "POST") {
            const reqBody = await request.json();
            requestIsByOwner =
              reqBody.channel_name.slice(9) === session.userToken.user_id;
          }
          if (routeData.method === "GET") {
            const url = new URL(request.url);
            const channel_name = url.searchParams.get("channel_name");
            requestIsByOwner =
              // @ts-ignore possible errors caught by try catch block
              channel_name.slice(9) === session.userToken.user_id;
          }
        } catch (error) {
          // channel_name not found
          return NextResponse.json("Valid channel_name required", {
            status: 400,
          });
        }

        // request to the channel is not by the owner
        if (!requestIsByOwner) {
          return NextResponse.json("unauthorized", {
            status: 403,
            statusText: "unauthorized",
          });
        }
      } else {
        // accessed route does not exist
        return NextResponse.json("Not found", {
          status: 404,
          statusText: "Not found",
        });
      }
    }
  }

  return NextResponse.next();
}
