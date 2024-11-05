
declare namespace Result {
  type Base = {
    status?: number
    error_code?: string
    error_message?: string
  }
  type Version = Base & {
    version?: string
  }
  type Login = Base & {
    token?: Token.Token,
    user_id?: string
  }
  type User = Base & {
    user?: User.Info
  }
  type AccList = Base & {
    accs?: Account.Info[]
  }
  type KeyList = Base & {
    access_keys?: Key.Info[]
  }
}

declare namespace Token {
  type Token = {
    token_id?: number
    token?: string
  }
  type Info = {
    token?: Token
    user_id?: string
  }
}

declare namespace User {
  type Info = {
    acc_id?: string
    access_keys?: string[]
    cellphone?: string
    department?: string
    descr?: string
    email?: string
    extension?: object
    fullname?: string
    landphone?: string
    parent_id?: number
    position?: string
    roleid?: number
    user_id?: string
  }
}

declare namespace Account {
  type Info = {
    acc_status?: number
    admin_email?: string
    admin_name?: string
    admin_phone?: string
    contact_address?: string
    contact_email?: string
    contact_name?: string
    contact_phone?: string
    id?: string
    license?: object
    initial_date?: string
    name?: string
    op_acc_id?: string
  }
}

declare namespace Key {
  type Info = {
    acc_id?: string
    access_key?: string
    description?: string
    expire_ts?: string
    name?: string
    privilege_tree?: Tree
  }
  type Tree = {
    api?: Api
  }
  type Api = {
    monitor_data?: Data
  }
  type Data = {
    update?: string
  }
  type Item = Info & {
    check?: string
    checked?: string
    disabled?: boolean
  }
}
