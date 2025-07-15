# Etapa 1: Construcción
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY ventas-service/pom.xml .
COPY ventas-service/src ./src
RUN mvn clean package -DskipTests -Dresource.delimiter=@ -DskipResourceFiltering=true

# Etapa 2: Ejecución
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]