# Scalabiliy - 01

Passos para executar o exercício:

1 - Build da imagem da aplicação:
``` shell
docker build -f ./src/01-scalability/01/Dockerfile -t <your-user>/scalability-node-web-app .
```

* Pull da imagem gerada (caso não quiser gerar a própria imagem)
``` shell
docker pull wluindayk/scalability-node-web-app
```

* Executar o container da aplicação:
``` shell
docker run -p 3001:3000 -d <your-user>/scalability-node-web-app
docker run -p 3002:3000 -d <your-user>/scalability-node-web-app
docker run -p 3003:3000 -d <your-user>/scalability-node-web-app
```

2 - Build da imagem do load balancer (com nginx):
``` shell
docker build -f ./src/01-scalability/01/nginx/Dockerfile -t <your-user>/scalability-nginx-loadbalance .
```

* Pull da imagem gerada (caso não quiser gerar a própria imagem)
``` shell
docker pull wluindayk/scalability-nginx-loadbalance
```

* Executar o container do load balancer:
``` shell
docker run -p 3000:80 <your-user>/scalability-nginx-loadbalance
```

3 - Realizar algumas chamadas via cURL no host do load balancer:
``` shell
curl http://localhost:3000
```

* Saídas esperadas:
``` shell
- http://22bad620754b:3000
- http://aad72724a6ce:3000
- http://a2e9ba4224d5:3000
```
Note a diferença no hostname, indicando que o load balancer alternou os requests entre os containers da aplicação.

Obs.: O hostname não é fixo, irá variar de máquina para máquina.