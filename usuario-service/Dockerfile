# Etapa de construcción
FROM maven:3.8.7-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Estrategia de cache para dependencias
COPY pom.xml .
RUN mvn dependency:go-offline

# Compilación
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa de producción
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copiar JAR construido
COPY --from=build /app/target/usuario-service-*.jar app.jar

# Configuración específica para este servicio
EXPOSE 8081
ENV SERVER_PORT=8081
ENTRYPOINT ["java", "-jar", "app.jar"]

# Variables opcionales para MongoDB (descomentar si se necesitan)
# ENV SPRING_DATA_MONGODB_URI=mongodb://mongodb:27017/masterbikes