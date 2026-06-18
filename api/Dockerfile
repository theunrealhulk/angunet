FROM mcr.microsoft.com/dotnet/sdk:10.0 AS dev
WORKDIR /app
RUN dotnet tool install --global dotnet-ef --version 10.0.*
ENV PATH="$PATH:/root/.dotnet/tools"

EXPOSE 5199
CMD ["dotnet", "watch", "run", "--project", "/app/app.csproj","--verbose"]
