import {config} from "@onflow/fcl"
import {config as  dotconfig} from "dotenv"
dotconfig()
config()
  .put("accessNode.api", "http://localhost:8080")
  .put("challenge.handshake", "http://localhost:3000/fcl/authn")
