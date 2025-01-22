// 作者の極めて偏った思想を反映.

document.addEventListener('DOMContentLoaded', function() {
    const chooseCPU1 = document.getElementById('chooseCPU1');
    const chooseCPU2 = document.getElementById('chooseCPU2');
    const chooseCPU3 = document.getElementById('chooseCPU3');

    chooseCPU1.addEventListener('change', function() {
        if (chooseCPU1.checked) {
            alert('サイト作者の極めて偏った思想により、Intel製CPUを選択することはできません。');
            chooseCPU3.checked = true;
        }
    });

    chooseCPU2.addEventListener('change', function() {
        if (chooseCPU2.checked) {
            alert('サイト作者がAMD製のCPUを全てリストアップすることを面倒くさがったため、CPUはRyzen 9000 Seriesしか選択できません。');
            chooseCPU3.checked = true;
        }
    });

    const chooseGPU1 = document.getElementById('chooseGPU1');
    const chooseGPU2 = document.getElementById('chooseGPU2');
    const chooseGPU3 = document.getElementById('chooseGPU3');

    chooseGPU2.addEventListener('change', function() {
        if (chooseGPU2.checked) {
            alert('サイト作者がNVIDIA GeForce Seriesの全てのGPUをリストアップすることを面倒くさがったため、GPUはRTX 4000 Seriesしか選択できません。');
            chooseGPU1.checked = true;
        }
    });

    chooseGPU3.addEventListener('change', function() {
        if (chooseGPU3.checked) {
            alert('サイト作者の極めて偏った思想により、AMD Radeon Seriesを選択することはできません。');
            chooseGPU1.checked = true;
        }
    });

    const decision = document.getElementById('decision');
    decision.addEventListener('click', async function() {
        const budget = parseInt(document.querySelector('input[name="btnGroupBudget"]:checked').nextElementSibling.textContent.trim()) * 10000;
        const os = document.querySelector('input[name="chooseOS"]:checked').nextElementSibling.textContent.trim();
        const ram = document.querySelector('.form-select').value;

        if (ram === 'Choose one') {
            alert('RAM容量を選択してください。');
            return;
        }

        if (ram === '64KiB') {
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `
                <div class="mb-5">
                    <h2 class="h4">あなたにはこれしかない。</h2>
                    <p class="h1 fw-bold">- Commodore 64</p>
                    <img src="assets/img/Commodore-64.png" alt="Commodore 64" style="max-width: 100%; height: auto;">
                    <p class="text-muted" style="font-size: small;">出典: <a href="https://commons.wikimedia.org/wiki/File:Commodore-64-Computer-FL.png" target="_blank">Wikimedia Commons</a></p>
                </div>
            `;
            return;
        }

        const cpuData = await fetch('assets/data/cpu.json').then(response => response.json());
        const gpuData = await fetch('assets/data/gpu.json').then(response => response.json());

        let selectedCPU = null;
        let selectedGPU = null;

        for (const [name, details] of Object.entries(cpuData)) {
            if (details.cost <= budget && (!selectedCPU || details.performance > selectedCPU.performance)) {
                selectedCPU = { name, ...details };
            }
        }

        for (const [name, details] of Object.entries(gpuData)) {
            if (details.cost <= budget && (!selectedGPU || details.performance > selectedGPU.performance)) {
                selectedGPU = { name, ...details };
            }
        }

        while (selectedCPU.cost + selectedGPU.cost > budget) {
            let newSelectedGPU = null;
            for (const [name, details] of Object.entries(gpuData)) {
                if (details.cost < selectedGPU.cost && (!newSelectedGPU || details.performance > newSelectedGPU.performance)) {
                    newSelectedGPU = { name, ...details };
                }
            }
            if (newSelectedGPU) {
                selectedGPU = newSelectedGPU;
            } else {
                let newSelectedCPU = null;
                for (const [name, details] of Object.entries(cpuData)) {
                    if (details.cost < selectedCPU.cost && (!newSelectedCPU || details.performance > newSelectedCPU.performance)) {
                        newSelectedCPU = { name, ...details };
                    }
                }
                if (newSelectedCPU) {
                    selectedCPU = newSelectedCPU;
                } else {
                    break;
                }
            }
        }

        const remainingBudget = budget - (selectedCPU.cost + selectedGPU.cost);

        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
            <h2 class="h2 mb-2">あなたにおすすめのパーツリスト</h2>
            <table class="table table-striped mb-5">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col" colspan="2">項目</th>
                <th scope="col">価格</th>
                <th scope="col">購入リンク</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <th scope="row">1</th>
                <td colspan="2">総予算</td>
                <td colspan="2">${budget}円</td>
                </tr>
                <tr>
                <th scope="row">2</th>
                <td>OS</td>
                <td>${os}</td>
                <td>price</td>
                <td><button type="button" class="btn btn-primary">購入</button></td>
                </tr>
                <tr>
                <th scope="row">3</th>
                <td>CPU</td>
                <td>${selectedCPU.name}</td>
                <td>参考価格: ${selectedCPU.cost}円</td>
                <td><button type="button" class="btn btn-primary">購入</button></td>
                </tr>
                <tr>
                <th scope="row">4</th>
                <td>GPU</td>
                <td>${selectedGPU.name}</td>
                <td>参考価格: ${selectedGPU.cost}円</td>
                <td><button type="button" class="btn btn-primary">購入</button></td>
                </tr>
                <tr>
                <th scope="row">5</th>
                <td>RAM容量</td>
                <td>${ram}</td>
                <td>price</td>
                <td><button type="button" class="btn btn-primary">購入</button></td>
                </tr>
                <tr>
                <th scope="row">6</th>
                <td colspan="2">余剰金</td>
                <td colspan="2">${remainingBudget}円</td>
                </tr>
            </tbody>
            </table>
        `;
    });
});
