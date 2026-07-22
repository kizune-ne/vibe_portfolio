/* JS Module: DevOps Infrastructure Topology & Live CLI Terminal Stand */
export function initDevOpsShowcase() {
  const cliOutputText = document.getElementById('cliOutputText');
  const cliCommandTabs = document.getElementById('cliCommandTabs');
  const topoCards = document.querySelectorAll('.topo-card');

  const cliCommandsData = {
    'docker-ps': `$ docker ps -a --format "table {{.Names}}\\t{{.Image}}\\t{{.Status}}\\t{{.Ports}}"
NAMES               IMAGE                            STATUS                   PORTS
ai-server           ai_server_devcontainer:latest    Up 30 days (healthy)     0.0.0.0:22->22/tcp
ollama              ollama/ollama:latest             Up 14 days (healthy)     0.0.0.0:11434->11434/tcp
open-webui          ghcr.io/open-webui/webui:main    Up 30 days (healthy)     0.0.0.0:3000->8080/tcp`,

    'nvidia-smi': `$ nvidia-smi --query-gpu=name,memory.total,memory.used,utilization.gpu --format=csv
name, memory.total [MiB], memory.used [MiB], utilization.gpu [%]
NVIDIA GeForce RTX 4070 Ti SUPER, 16384 MiB, 8420 MiB, 42 %

+-----------------------------------------------------------------------------------------+
| Processes:                                                                              |
|  GPU   GI   CI        PID   Type   Process name                              GPU Memory |
|        ID   ID                                                               Usage      |
|=========================================================================================|
|    0   N/A  N/A      8410      C   /root/.ollama/runners/cuda_v11/ollama_llama_server 8192MiB|
+-----------------------------------------------------------------------------------------+`,

    'docker-volume': `$ docker volume ls & docker inspect mounts
DRIVER    VOLUME NAME
local     ai-server-venv
local     ollama_storage

Mount Details [ai-server]:
- Type: volume  | Source: ai-server-venv -> Target: /workspaces/AI_Server/.venv
- Type: bind    | Source: D:/AI_Server/_keys/.gemini -> Target: /home/node/.gemini
- Type: bind    | Source: D:/AI_Server/_keys/.ssh -> Target: /home/node/.ssh
- Type: bind    | Source: /var/run/docker.sock -> Target: /var/run/docker.sock (DinD)`
  };

  function selectCliCommand(cmdKey) {
    if (!cliCommandsData[cmdKey]) return;

    if (cliCommandTabs) {
      const btns = cliCommandTabs.querySelectorAll('.cli-tab-btn');
      btns.forEach(btn => {
        if (btn.getAttribute('data-cmd') === cmdKey) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    if (cliOutputText) {
      cliOutputText.textContent = cliCommandsData[cmdKey];
    }
  }

  if (cliCommandTabs) {
    const btns = cliCommandTabs.querySelectorAll('.cli-tab-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cmdKey = btn.getAttribute('data-cmd');
        selectCliCommand(cmdKey);
      });
    });
  }

  topoCards.forEach(card => {
    card.addEventListener('click', () => {
      topoCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const containerKey = card.getAttribute('data-container');
      if (containerKey === 'ollama') {
        selectCliCommand('nvidia-smi');
      } else if (containerKey === 'devcontainer') {
        selectCliCommand('docker-volume');
      } else {
        selectCliCommand('docker-ps');
      }
    });
  });

  // Default selection
  selectCliCommand('docker-ps');
}
