# ====== build ======
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q -e -DskipTests dependency:go-offline
COPY src ./src
RUN mvn -q -e -DskipTests package

# ====== run ======
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
# Если у тебя jar один — boot repackage кладёт в target/*.jar
COPY --from=build /app/target/*.jar /app/app.jar
EXPOSE 8081
ENV JAVA_OPTS=""
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
