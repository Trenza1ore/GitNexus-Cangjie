package example.svc

/**
 * Core service — target of factory + member call from another package.
 */
public class Core {
    public init() {}

    public func parse(): Int32 {
        return 0
    }
}

public func getCore(): Core {
    return Core()
}
