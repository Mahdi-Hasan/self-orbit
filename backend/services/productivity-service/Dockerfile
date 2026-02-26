FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src
COPY backend/building-blocks/ building-blocks/
COPY backend/services/productivity-service/ services/productivity-service/
RUN dotnet restore services/productivity-service/src/Api/SelfOrbit.ProductivityService.Api.csproj
RUN dotnet publish services/productivity-service/src/Api/SelfOrbit.ProductivityService.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 5002
ENV ASPNETCORE_URLS=http://+:5002
HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD curl -f http://localhost:5002/health || exit 1
ENTRYPOINT ["dotnet", "SelfOrbit.ProductivityService.Api.dll"]
