FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src

COPY backend/building-blocks/ building-blocks/
COPY backend/services/expense-service/ services/expense-service/

RUN dotnet restore services/expense-service/src/Api/SelfOrbit.ExpenseService.Api.csproj
RUN dotnet publish services/expense-service/src/Api/SelfOrbit.ExpenseService.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS runtime
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 5001
ENV ASPNETCORE_URLS=http://+:5001

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5001/health || exit 1

ENTRYPOINT ["dotnet", "SelfOrbit.ExpenseService.Api.dll"]
