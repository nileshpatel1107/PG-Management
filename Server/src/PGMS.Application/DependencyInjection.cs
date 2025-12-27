using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using PGMS.Application.Services;
using System.Reflection;

namespace PGMS.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // AutoMapper
        services.AddAutoMapper(Assembly.GetExecutingAssembly());

        // FluentValidation
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        // Services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IPGService, PGService>();
        services.AddScoped<IRoomService, RoomService>();
        services.AddScoped<IComplaintService, ComplaintService>();

        return services;
    }
}
