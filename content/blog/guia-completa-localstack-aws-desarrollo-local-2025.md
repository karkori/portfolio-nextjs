---
title: Guía Completa de LocalStack en 2025 - AWS Local sin Costos ni Complicaciones
date: 2025-04-14T20:45:00.000Z
thumbnail: /images/blog/localstack-aws.png
description: Aprende a utilizar LocalStack para emular servicios de AWS en tu entorno local, acelerar tu desarrollo y reducir costos mientras simulas una infraestructura cloud completa.
category: Dev-tools
tags:
  - aws
  - localstack
  - cloud
  - dev-tools
  - devops
---

## ¿Por qué usar LocalStack para desarrollo con AWS?

Hace un par de años, mientras trabajaba en un proyecto que utilizaba varios servicios de AWS, me encontré con un problema común: cada pequeño cambio requería desplegarlo en la nube, esperar, verificar el resultado y, a menudo, volver a empezar cuando algo no funcionaba como esperaba. No solo estábamos acumulando costos innecesarios, sino que el ciclo de desarrollo se había vuelto frustrante y lento.

Fue entonces cuando un compañero me mencionó LocalStack. "Es como tener AWS en tu portátil", me dijo. Sinceramente, sonaba demasiado bueno para ser verdad. Pero después de probarlo durante una semana, cambió completamente mi forma de desarrollar para la nube.

En este artículo, te mostraré cómo LocalStack se ha convertido en una herramienta imprescindible para cualquier desarrollador que trabaje con AWS en 2025, y cómo puedes configurarlo y utilizarlo para tus proyectos.

## ¿Qué es LocalStack y cómo funciona?

LocalStack es un emulador de servicios de AWS que se ejecuta completamente en tu entorno local a través de un contenedor Docker. Proporciona una implementación funcional de las APIs de AWS, permitiéndote desarrollar y probar tus aplicaciones en la nube sin necesidad de conectarte a AWS.

En esencia, LocalStack crea una "mini AWS" en tu máquina local que:

- Imita el comportamiento de los servicios de AWS más populares
- Responde a los mismos comandos de AWS CLI que usarías en la nube real
- Permite utilizar las mismas SDK y herramientas que usarías normalmente
- Funciona sin conexión a internet (¡increíble para programar en aviones!)
- No requiere credenciales AWS reales (aunque puedes configurarlas)

En 2025, LocalStack ha madurado significativamente, ofreciendo soporte para más de 60 servicios de AWS en su versión Community (gratuita) y más de 80 en su versión Pro.

## LocalStack vs. Alternativas: ¿Por qué elegirlo?

Antes de profundizar en LocalStack, es importante entender cómo se compara con otras opciones disponibles:

| Característica | LocalStack | AWS SAM Local | AWS CDK Local | Moto |
|----------------|------------|---------------|---------------|------|
| Tipo | Emulador completo | Específico para serverless | Framework de IaC | Biblioteca de testing |
| Servicios soportados | +60 (Community), +80 (Pro) | Principalmente Lambda y API Gateway | Los compatibles con CDK | Aproximadamente 30-40 |
| Ejecución | Contenedor Docker | CLI local | Según configuración | Biblioteca Python |
| Persistencia | Configurable | Limitada | Según configuración | En memoria |
| Independencia de AWS | Total | Parcial | Baja | Total |

Después de probar varias alternativas, me quedé con LocalStack por tres razones principales:

1. **Amplitud de servicios**: Puedo simular prácticamente cualquier arquitectura AWS.
2. **Facilidad de uso**: Un solo contenedor proporciona todos los servicios.
3. **Consistencia**: El comportamiento es muy similar al de AWS real.

A principios de 2025, LocalStack introdujo mejoras significativas en la compatibilidad con AWS CDK y Terraform, eliminando una de sus limitaciones históricas.

## Instalación y configuración de LocalStack

Comenzar con LocalStack es sorprendentemente sencillo. Aquí te muestro cómo hacerlo paso a paso:

### Requisitos previos

- Docker instalado en tu sistema
- AWS CLI (opcional, pero recomendado)
- Conocimientos básicos de línea de comandos

### Instalación con Docker

La forma más sencilla de ejecutar LocalStack es mediante Docker:

```bash
docker run --name localstack -p 4566:4566 -p 4510-4559:4510-4559 -e SERVICES=s3,lambda,dynamodb localstack/localstack
```

Este comando inicia un contenedor con soporte para S3, Lambda y DynamoDB. Para ejecutar todos los servicios disponibles, puedes omitir el parámetro `SERVICES`.

### Configuración con Docker Compose

Para una configuración más avanzada, recomiendo usar Docker Compose. Aquí tienes un ejemplo de mi archivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  localstack:
    container_name: localstack
    image: localstack/localstack:latest
    ports:
      - "4566:4566"            # Puerto principal para todos los servicios AWS
      - "4510-4559:4510-4559"  # Puertos adicionales para servicios específicos
    environment:
      - DEBUG=1                # Modo debug para más información
      - PERSIST=1              # Persistencia entre reinicios
      - DOCKER_HOST=unix:///var/run/docker.sock
      - SERVICES=s3,lambda,dynamodb,sqs,sns,iam,cloudformation
    volumes:
      - "${LOCALSTACK_VOLUME_DIR:-./volume}:/var/lib/localstack"
      - "/var/run/docker.sock:/var/run/docker.sock"
```

Para iniciar este entorno:

```bash
docker-compose up -d
```

La primera vez que configuré esto me sorprendió lo rápido que se levantaba todo el stack - estamos hablando de segundos, no minutos como en otras soluciones similares.

### Configuración del AWS CLI

Para interactuar con LocalStack usando AWS CLI, simplemente añade `--endpoint-url=http://localhost:4566` a tus comandos:

```bash
aws --endpoint-url=http://localhost:4566 s3 mb s3://mi-bucket
```

Alternativamente, puedes crear un perfil específico para LocalStack en tu archivo `~/.aws/config`:

```
[profile localstack]
region = us-east-1
output = json
endpoint_url = http://localhost:4566
```

Y luego usarlo así:

```bash
aws --profile localstack s3 mb s3://mi-bucket
```

Una pequeña anécdota: pasé varias horas frustrado porque mis comandos de AWS CLI no funcionaban con LocalStack, hasta que me di cuenta de que había olvidado añadir el parámetro `--endpoint-url`. A veces los errores más simples son los que más tiempo nos hacen perder.

## Trabajando con servicios AWS en LocalStack

### S3: Almacenamiento de objetos

S3 es uno de los servicios mejor implementados en LocalStack. Aquí hay algunos comandos útiles:

```bash
# Crear un bucket
aws --endpoint-url=http://localhost:4566 s3 mb s3://mi-bucket

# Subir un archivo
aws --endpoint-url=http://localhost:4566 s3 cp archivo.txt s3://mi-bucket/

# Listar objetos
aws --endpoint-url=http://localhost:4566 s3 ls s3://mi-bucket/
```

En código Python, puedes conectarte así:

```python
import boto3

# Configurar el cliente S3 para LocalStack
s3 = boto3.client(
    's3',
    endpoint_url='http://localhost:4566',
    aws_access_key_id='test',
    aws_secret_access_key='test',
    region_name='us-east-1'
)

# Crear un bucket
s3.create_bucket(Bucket='mi-bucket')

# Subir un archivo
s3.upload_file('archivo.txt', 'mi-bucket', 'archivo.txt')
```

### Lambda: Funciones serverless

LocalStack permite ejecutar funciones Lambda localmente. Aquí está un ejemplo completo:

1. Crea un archivo `function.py`:

```python
def handler(event, context):
    print("Recibido evento:", event)
    return {
        'statusCode': 200,
        'body': 'Hola desde Lambda local!'
    }
```

2. Empaquétalo en un zip:

```bash
zip function.zip function.py
```

3. Crea la función en LocalStack:

```bash
aws --endpoint-url=http://localhost:4566 lambda create-function \
    --function-name mi-funcion \
    --runtime python3.10 \
    --handler function.handler \
    --role arn:aws:iam::000000000000:role/lambda-role \
    --zip-file fileb://function.zip
```

4. Invoca la función:

```bash
aws --endpoint-url=http://localhost:4566 lambda invoke \
    --function-name mi-funcion \
    --payload '{"key": "value"}' \
    salida.json
```

En 2025, LocalStack ha mejorado notablemente el soporte para funciones Lambda que utilizan capas y dependencias complejas.

### DynamoDB: Base de datos NoSQL

Puedes crear tablas en DynamoDB local y realizar operaciones CRUD:

```bash
# Crear una tabla
aws --endpoint-url=http://localhost:4566 dynamodb create-table \
    --table-name Usuarios \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

# Insertar un item
aws --endpoint-url=http://localhost:4566 dynamodb put-item \
    --table-name Usuarios \
    --item '{"id": {"S": "1"}, "nombre": {"S": "Ana"}, "edad": {"N": "28"}}'

# Consultar datos
aws --endpoint-url=http://localhost:4566 dynamodb scan --table-name Usuarios
```

La primera vez que vi los datos aparecer en mi tabla local de DynamoDB, fue uno de esos momentos "¡eureka!" que todos experimentamos como desarrolladores. Poder iterar rápidamente con datos persistentes sin preocuparme por los costos fue liberador.

## Patrones avanzados con LocalStack

A medida que he ido utilizando LocalStack en proyectos más complejos, he desarrollado algunos patrones que pueden serte útiles:

### 1. Inicialización automática de recursos

Puedes crear un script que inicialice automáticamente todos los recursos AWS que necesitas:

```bash
#!/bin/bash

# Esperar a que LocalStack esté listo
echo "Esperando a que LocalStack esté disponible..."
aws --endpoint-url=http://localhost:4566 s3 ls > /dev/null 2>&1
while [ $? -ne 0 ]
do
    sleep 1
    aws --endpoint-url=http://localhost:4566 s3 ls > /dev/null 2>&1
done

# Crear recursos
echo "Creando recursos en LocalStack..."

# S3
aws --endpoint-url=http://localhost:4566 s3 mb s3://app-bucket

# DynamoDB
aws --endpoint-url=http://localhost:4566 dynamodb create-table \
    --table-name Tasks \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

echo "Recursos creados correctamente."
```

### 2. Persistencia entre reinicios

A partir de 2025, LocalStack ofrece una persistencia mejorada. Para habilitar la persistencia de datos entre reinicios:

```yaml
services:
  localstack:
    # ... otras configuraciones ...
    environment:
      - PERSIST=1
    volumes:
      - "${LOCALSTACK_VOLUME_DIR:-./volume}:/var/lib/localstack"
```

Este volumen conservará todos tus datos y configuraciones cuando reinicies el contenedor.

### 3. Integración con AWS CDK

La integración de LocalStack con AWS CDK ha mejorado significativamente en 2025. Aquí tienes un ejemplo:

```typescript
// En tu archivo de stack CDK
import * as cdk from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export class MyStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new Bucket(this, 'MyBucket', {
      bucketName: 'my-cdk-bucket',
      versioned: true,
    });
  }
}
```

Para desplegar esto en LocalStack:

```bash
CDK_DEPLOY_ACCOUNT=000000000000 CDK_DEPLOY_REGION=us-east-1 npx cdk deploy --context endpoint=http://localhost:4566
```

La primera vez que logré que esto funcionara, me ahorró horas de desarrollo iterativo.

## Casos de uso reales: Cómo utilizamos LocalStack en producción

Durante los últimos dos años, he implementado LocalStack en varios proyectos del mundo real. Aquí hay algunos casos de uso:

### Caso 1: Desarrollo de microservicios en Spring Boot

Desarrollamos una aplicación de gestión de inventario con múltiples microservicios en Spring Boot que utilizaban varios servicios de AWS:

- S3 para almacenar archivos de productos
- SQS y SNS para comunicación asíncrona
- DynamoDB para almacenamiento de datos de alta velocidad

Toda la arquitectura se ejecutaba localmente con LocalStack, permitiendo a los desarrolladores trabajar sin conexión y sin generar costos.

Configuración en `application.yml`:

```yaml
cloud:
  aws:
    region:
      static: us-east-1
    stack:
      auto: false
    credentials:
      access-key: test
      secret-key: test
    endpoint: http://localhost:4566
```

### Caso 2: Pipeline de CI/CD con GitHub Actions

Implementamos LocalStack en nuestro pipeline de CI/CD para probar la infraestructura como código:

```yaml
name: Test Infrastructure

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      localstack:
        image: localstack/localstack
        ports:
          - 4566:4566
        options: >-
          --name=localstack
          --env=SERVICES=s3,dynamodb,lambda
          
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Terraform
        uses: hashicorp/setup-terraform@v2
      
      - name: Deploy to LocalStack and Test
        run: |
          terraform init
          terraform apply -auto-approve
          # Ejecutar pruebas contra la infraestructura local
```

Esta configuración nos permitió probar cambios de infraestructura antes de aplicarlos en producción, evitando costosos errores.

### Caso 3: Aplicación serverless con Node.js

Desarrollamos una API serverless utilizando API Gateway y funciones Lambda:

```javascript
// Configuración para conectar con LocalStack
const AWS = require('aws-sdk');
const endpoint = 'http://localhost:4566';

const dynamoDB = new AWS.DynamoDB.DocumentClient({
  endpoint,
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test'
  }
});

// Handler de Lambda
exports.handler = async (event) => {
  const params = {
    TableName: 'Products',
    Item: {
      id: event.id,
      name: event.name,
      price: event.price
    }
  };

  await dynamoDB.put(params).promise();
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Producto guardado' })
  };
};
```

Este enfoque nos permitió desarrollar y probar rápidamente toda la infraestructura serverless.

## Limitaciones y consideraciones

A pesar de sus muchas ventajas, LocalStack tiene algunas limitaciones que debes considerar:

### 1. Diferencias con AWS real

Aunque LocalStack imita bien a AWS, hay diferencias sutiles. Por ejemplo:

- Algunas validaciones avanzadas pueden no estar implementadas
- Los límites de cuota no se aplican de la misma manera
- El rendimiento es diferente (a veces mejor, a veces peor)

### 2. Servicios no disponibles en la versión Community

La versión gratuita de LocalStack (Community) no incluye todos los servicios. A abril de 2025, estos servicios requieren la versión Pro:

- Amazon Cognito
- AWS Bedrock
- AppSync
- Algunos aspectos avanzados de otros servicios

### 3. Recursos del sistema

LocalStack puede consumir bastantes recursos, especialmente cuando ejecutas muchos servicios simultáneamente. En mi experiencia, asignar al menos 4GB de RAM a Docker produce los mejores resultados.

Un día me encontré con mi laptop sobrecalentándose mientras ejecutaba LocalStack junto con otras herramientas de desarrollo. Descubrí que limitar los servicios a solo los que necesitaba y establecer límites de recursos en Docker resolvió el problema.

## Versión Community vs. Pro: ¿Vale la pena pagar?

LocalStack ofrece dos versiones:

### Community (Gratuita)
- +60 servicios AWS
- Soporte básico
- Sin limitaciones técnicas (solo de servicios)
- Ideal para desarrolladores individuales y proyectos pequeños

### Pro (De pago, ~20€/mes por desarrollador en 2025)
- +80 servicios AWS
- Mejor soporte y rendimiento
- Herramientas adicionales (UI web, monitorización)
- Mejor para equipos y empresas

Mi recomendación personal: comienza con la versión Community. Para la mayoría de los desarrollos es más que suficiente. Si te encuentras necesitando servicios específicos que solo están en Pro (como Cognito), considera la actualización.

## Conclusión: LocalStack en tu flujo de trabajo diario

Después de dos años utilizando LocalStack intensivamente, puedo decir que ha cambiado fundamentalmente mi forma de desarrollar para AWS. Los beneficios son claros:

- **Velocidad de desarrollo**: Ciclos de iteración más rápidos
- **Ahorro de costos**: Desarrollo y pruebas sin gastar en AWS
- **Independencia**: Trabajar sin conexión a internet
- **Consistencia**: Entornos de desarrollo uniformes para todo el equipo

Si estás desarrollando aplicaciones para AWS en 2025, LocalStack debería ser parte de tu stack de herramientas. El tiempo que inviertas en configurarlo se recuperará rápidamente con la mejora en productividad.

¿Has utilizado LocalStack en tus proyectos? ¿O prefieres alguna alternativa? Me encantaría conocer tu experiencia. Déjame un comentario compartiendo tus trucos y consejos para trabajar con AWS localmente.

Y si estás comenzando con AWS, no dudes en probar LocalStack. Podría ahorrarte muchos dolores de cabeza (y dinero) en tu camino hacia la nube.
