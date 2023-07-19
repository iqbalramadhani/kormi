export default async function uploadFileToBase64(files) {
  let len = files.length;
  let base64Files = [];
  for (let i = 0; i < len; i++) {
    let result = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(files[i]);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (erorr) => {
        reject(erorr);
      };
    });
    base64Files[i] = await result;
  }
  return base64Files;
}
