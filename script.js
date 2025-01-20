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
});
