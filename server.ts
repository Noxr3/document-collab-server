import { Server } from '@hocuspocus/server'
import { Logger } from '@hocuspocus/extension-logger'
import { Database } from '@hocuspocus/extension-database'
import { connect } from './lib/supabase'

const supabase = connect()

const server = Server.configure({
  port: 1234,
  
  // 添加日志扩展
  extensions: [
    new Logger({
      onLoadDocument: false,
      onChange: false,
    }),
    
    // 添加内存数据库扩展
    new Database({
      // 使用内存存储（生产环境建议使用持久化存储）
      fetch: async ({ documentName }) => {
        return new Promise((resolve, reject) => {
        const supabase = connect()
        supabase.from('documents').select('*').eq('id', documentName).single().then(({ data, error }) => {
          if (error) {
            reject(error)
          } else {
            //@ts-ignore
            resolve(data.data)
          }
        })
      })
      },
      store: async ({ documentName, document }) => {
        const supabase = connect()
        await supabase.from('documents').upsert({ id: documentName, data: document },{ onConflict: 'id' })
      }

    }),
  ],

  // 可选：添加连接事件处理
  async onConnect(data) {
    console.log('Client connected:', data.documentName)
    return true
  },

  // 可选：添加文档加载处理
  async onLoadDocument(data) {
    console.log('Loading document:', data.documentName)
    return null // 返回初始文档内容，null 表示新文档
  },
})

// 启动服务器
server.listen()
console.log('Hocuspocus server is running on port 1234')
