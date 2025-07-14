# Etapa 1: Construcción del proyecto
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY arriendo-service/pom.xml .
COPY arriendo-service/src ./src
RUN mvn clean package -DskipTests -Dresource.delimiter=@ -DskipResourceFiltering=true
# Etapa 2: Imagen final
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/arriendo-service-*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]