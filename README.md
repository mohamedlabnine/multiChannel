# Uml Conception

tools for build Uml : https://www.plantuml.com/plantuml/uml/SyfFKj2rKt3CoKnELR1Io4ZDoSa70000

code :

@startuml
class Client {
  +id: UUID
  +name: string
  +sender_id: string
  +smtp_id: string
  +wa_id: string
}

class AuthUser {
  +id: UUID
  +name: string
  +prenom: string
  +email: string
  +password: string
  +active: boolean
  +role_id: UUID
  +client_id: UUID

}

class AuthRole {
  +id: UUID
  +name: string
}

class Liste {
  +id: UUID
  +code: string
  +name: string
  +description: string
}

class Contact {
  +id: UUID
  +name: string
  +phone: string
  +email: string
  +liste_id: UUID
}



AuthUser --> AuthRole : "a un"
Contact --> Liste : "appartient à"

@enduml
