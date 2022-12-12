import { v4 as uuid } from "uuid";


export const fileNamer = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
    if (!file) return callback(new Error('The file is empty'), null)

    const fileType = file.mimetype.split('/')[1];
    const firstName = uuid()

    const fileName = `${firstName}.${fileType}`

    return callback(null, fileName)

}