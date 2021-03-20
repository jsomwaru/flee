import {config} from "@onflow/fcl"


config()
  .put("accessNode.api", "http://localhost:8080")
  .put("challenge.handshake", "http://localhost:8701/flow/authenticate")
