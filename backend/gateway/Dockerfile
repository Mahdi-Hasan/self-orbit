FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src
COPY backend/gateway/ gateway/
RUN dotnet restore gateway/src/SelfOrbit.Gateway/SelfOrbit.Gateway.csproj
RUN dotnet publish gateway/src/SelfOrbit.Gateway/SelfOrbit.Gateway.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "SelfOrbit.Gateway.dll"]
