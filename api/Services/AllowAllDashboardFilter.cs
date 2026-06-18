using Hangfire.Dashboard;

public class AllowAllDashboardFilter : IDashboardAuthorizationFilter
{
    public bool Authorize(DashboardContext context)
    {
        // Allow all connections during local development/Docker testing
        return true;
    }
}