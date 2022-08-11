import html2canvas from 'html2canvas';

export const getSnapShot = async (elementId) => {
    const snapShotElement = document.getElementById(elementId)
    if (!snapShotElement) return ''
    const canvas = await html2canvas(snapShotElement, {
        allowTaint: false,
        useCORS: true,
        ignoreElements: (element) => {
            if(element.className == 'notice-bar') return true
            if(element.className == 'resize-handler-wrapper') return true
            return false
        }
    })
    console.log(elementId)
    canvas.toBlob(function(blob) {
            let binaryData = [];
            binaryData.push(blob);
            let url = window.URL.createObjectURL(new Blob(binaryData))
            const a = document.createElement('a')
            a.href = url
            a.download = "export.png"
            a.click()
            return url
    });


    // const shot = canvas.toDataURL('image/png')
    // console.log(shot)
    // const a = document.createElement('a')
    // a.href = shot
    // a.download = "事例.png"
    // a.click()
    // return shot
}
