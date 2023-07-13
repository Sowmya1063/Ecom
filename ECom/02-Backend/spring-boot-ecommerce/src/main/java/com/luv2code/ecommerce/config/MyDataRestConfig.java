package com.luv2code.ecommerce.config;
import java.util.*;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;

import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;

import com.luv2code.ecommerce.entity.Country;
import com.luv2code.ecommerce.entity.Order;
import com.luv2code.ecommerce.entity.Product;
import com.luv2code.ecommerce.entity.ProductCategory;
import com.luv2code.ecommerce.entity.State;

import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;


@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer{

    private EntityManager entityManager;
    @Value("${allowed.origins}")
    String [] AllowedOrigins;
    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager)
    {
         entityManager=theEntityManager;
    }
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config,CorsRegistry cors){
             HttpMethod[] theUnsopportedActions={HttpMethod.PUT,HttpMethod.POST,HttpMethod.DELETE,HttpMethod.PATCH};
             
             extracted(Product.class,config, theUnsopportedActions);
             extracted(ProductCategory.class,config, theUnsopportedActions);
             extracted(State.class,config, theUnsopportedActions);
             extracted(Country.class,config, theUnsopportedActions);
             extracted(Order.class,config, theUnsopportedActions);
              exposeIds(config);
              cors.addMapping( config.getBasePath()+"/**").allowedOrigins(AllowedOrigins);
    }
    private void extracted(Class theClass,RepositoryRestConfiguration config, HttpMethod[] theUnsopportedActions) {
        config.getExposureConfiguration().forDomainType(theClass).
         withItemExposure((metdata,httpMethods)->httpMethods.disable(theUnsopportedActions))
         .withCollectionExposure((metdata,httpMethods)->httpMethods.disable(theUnsopportedActions));
        
        
    }
    private void exposeIds(RepositoryRestConfiguration config) {
        Set<EntityType<?>> entities=entityManager.getMetamodel().getEntities();
        List<Class> entityClasses=new ArrayList<>();
        for(EntityType temp:entities)
        {
            entityClasses.add(temp.getJavaType());
        }
        Class[] domainTypes=entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
