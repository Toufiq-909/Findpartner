const bcrypt=require('bcrypt');
hello()
async function hello()
{
    let a=await bcrypt.hash('1234',1)
    console.log(a);
    console.log(await
        bcrypt.compare('1234',a))
}