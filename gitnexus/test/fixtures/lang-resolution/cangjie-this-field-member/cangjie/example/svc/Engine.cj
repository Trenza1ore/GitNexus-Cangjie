package example.svc

/**
 * Service reached via `private let engine = getEngineService()` + `this.engine.*`.
 */
public class Engine {
    public init() {}

    public func engineGet(peerType: String): Int32 {
        return 0
    }
}

public func getEngineService(): Engine {
    return Engine()
}
