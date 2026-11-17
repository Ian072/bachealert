# Etapa 1: compilar el proyecto con Maven
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn -q package -DskipTests

# Etapa 2: imagen liviana que solo ejecuta el servidor
FROM eclipse-temurin:21-jre
WORKDIR /app

# El modelo va junto al jar: el código lo busca en modelo/ (ruta relativa)
COPY modelo ./modelo
COPY --from=build /build/target/bachealert-0.1.jar app.jar

# En producción la consola de H2 queda apagada
ENV H2_CONSOLE=false

# Render tiene poca memoria: limitamos Java para dejar espacio a ONNX Runtime
ENV JAVA_OPTS="-XX:MaxRAMPercentage=60 -XX:+UseSerialGC"

EXPOSE 8080
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
