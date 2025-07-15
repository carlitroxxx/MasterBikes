# Etapa 1: Construcción
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY carrito-service/pom.xml .
COPY carrito-service/src ./src
RUN mvn clean package -DskipTests -Dresource.delimiter=@ -DskipResourceFiltering=true

# Etapa 2: Ejecución
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/carrito-service-*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]